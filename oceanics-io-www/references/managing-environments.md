---
title: Managing environments
date: "2017-09-27T12:00:00.000Z"
description: "Managing data science environments and packages"
tags: ["python", "anaconda", "pip", "distributed computing", "workshop"]
---

# Virtual environments

There are a lot of tools to help manage developing scientific code bases. 
Learn to use them. 
At the very least become familiar with environments, package managers, and version control.

The environment is the configuration and other software available to the program of interest. 
Packages are installed into an environment, and different environments may have different versions. 
This helps avoid issues of compatibility between different versions.

Version control and repositories help you keep a clean house. 
You can know who made changes when, and revert to old working versions if something breaks. 
Repositories keep your work backed up, and give others a place to download it from. 
For any sort of collaboration, these are mandatory. 


## Conda

Once you can login without a password from the terminal, we use `conda` and `pip` to build an environment 
that includes the necessary dependencies. The former will install the later.
Conda is an excellent tool for managing complex Python+ environments.

### x86 installation

For an Intel x86_64 architecture (e.g. MacBook, Droplet), you can download the Miniconda package with 

```bash
wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
sh ./Miniconda3-latest-Linux-x86_64.sh
```

### ARM installation

For the Raspberry Pi 3, install ARM7 conda:

```bash
wget https://github.com/jjhelmus/berryconda/releases/download/v2.0.0/Berryconda3-2.0.0-Linux-armv7l.sh
chmod +x Berryconda3-2.0.0-Linux-armv7l.sh
sh ./Berryconda3-2.0.0-Linux-armv7l.sh
```

Logout, then back in, to ensure the binary is in your path. You create and activate a scientific computing environment,
in this case called “oceanics”, then install required python packages into the environment using conda:

```bash
conda update conda
conda create —n oceanics
conda info —-envs
source activate oceanics
```

## Pip

Pip is the short-form of Python-installs-Python. Install additional packages into the active environment with `pip install package`. 
You can also [package your own scripts](https://python-packaging.readthedocs.io/en/latest/minimal.html#) as pip compliant distributions, 
which will make it easier to port between systems or share with others. 
Pip can handle and automatically install complex dependencies. 

```bash
pip install bidict rdp pyproj pyshp pyglet geopandas mpi4py boost job_stream gdal cmake osmnx bottleneck rtree scrapy geopy shapely gridded dateutil numexpr tz bs4 html5lib openpyxl tables xldd xlwt sqlalchemy h5py lxml
```


### Distributing packages

An example directory structure is:

```
satcdf-1.0/
	satcdf/
		__init__.py
		image.py 
		processing.py
	setup.py
	test.py
```

The `satcdf-1.0` directory is the location of the version control system (VCS). 
In this case we use `git`, which will be addressed in the next section. 
The `__init__.py` file tells the interpreter that this is a module, this is the entry point. 
It contains only two lines, which import classes and functions from  `image.py` and `processing.py`,

```
from . import image
from . import processing
```

The former contains methods for loading, subsetting, and saving satellite data. 
The later contains methods for processing and analyzing the data. 
Test procedures are in, you guessed it, `test.py`. 

The `setup.py` is,

```
from setuptools import setup

setup(name='satcdf',
    version='0.1',
    description='Satellite processing library',
    url='none',
    author='oceanics.io',
    author_email='aquaculture@oceanics.io',
    license='MIT',
    packages=['satcdf'],
    zip_safe=False)
```

The package can be install from within `satcdf-1.0` with `pip install -e .`, which establishes a symbolic link, 
so changes in local files will automatically be promulgated when the scripts are run. 
Then you can just `import satcdf` in another python applications without specifying a path.

# Version Control

Paired with a repository, version control can help manage releases, track changes, and free distribute to others. 
Github is popular, but does not allow free private repositories. Github was recently purchased by Microsoft, 
if you care about that kind of thing. Bitbucket is an alternative. Both use `git` repositories. 

If are starting a new project, and have gone through the steps above to package code, 
you first need to create a blank repository on your service of preference. 
Create a new repository inside your upper level app folder with `git init`. 
Create a `.gitignore` file that contains folders and files to omit. 
Github provides [an example](https://github.com/github/gitignore/blob/master/Python.gitignore) for Python projects. 

Probably only `__pycache__/` and `*.egg-info` are relevant. Add `.DS_Store` on macOS. 
Use `git add --all` to flag all files except the ignored ones, commit it, and add a remote URL similar to above, 

```bash
git commit -a -m "New image processing repository committed."
git remote add origin https://username@bitbucket.org/aquaculture/bathysphere.git
git push -u origin master
```

If an open source project is already available on Github or Bitbucket, you need to clone or install it to you local machine. 
You can use `ssh` or `https`. The link can be found on the repository page.
 In the terminal, `cd` into a working directory and clone the project repository. 
 This clones this document and sample code into the current directory,

```bash
git clone https://bitbucket.org/aquaculture/bathysphere.git
```

Where it can be installed with `pip install -e .`. If you are making changes, you can add individual files to your local 
repository with `git add filename`, and then use `git commit -m "message"` from within the project folder. 
To change the remote path, update the origin URL, for instance:

```bash
git remote set-url origin https://username@bitbucket.org/aquaculture/bathysphere.git
```

Commit changes to a single file with message, and avoid dumping into the VI text editor, with the one-line command,

```bash
git commit -m "Updated README" README.md
git push origin master
```